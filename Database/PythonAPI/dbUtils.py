import pyodbc
import keyring as kr
from terminalUtils import PrettyText as pt
from typing import List, Tuple


class Server:
    def __init__(self, serverName: str, databaseName: str, logging=True) -> 'Server':
        self.serverName = serverName
        self.databaseName = databaseName

        self.connection = None
        self.connectedUser = None
        self.cursor = None

        self.__logging = logging

    def __str__(self):
        return f"Server: {self.serverName}\nDatabase: {self.databaseName} User: {self.connectedUser}"

    def __connect(self, username: str) -> bool:
        '''
        Internal Connection Function
        ----------------------------
        Params:
        - username: str - the username for the database - must be associate with as password in keyring - if not, will prompt for password

        Returns:
        - bool - True if connection successful, False connection or cursor creation failed
        '''
        password = kr.get_password("Nexus", username)
        if password is None:
            print(pt.importantTextMedium(f"No password found for user {username}."))
            password = input("Enter password: ")
            kr.set_password("Nexus", username, password)

        connection = None

        try:
            connection = pyodbc.connect(
                'Driver={SQL Server};'
                'Server=' + self.serverName + ';'
                'Database=' + self.databaseName + ';'
                'UID=' + username + ';'
                'PWD=' + password + ';'
                'Trusted_Connection=no;'
            )
        except pyodbc.Error:
            print(pt.importantTextBad(f"Failed to connect for user: {username} {self.databaseName}@{self.serverName}"))
            print(pyodbc.Error.__traceback__)
            return False

        # Run connection test
        self.connection = connection
        self.connectedUser = username
        self.cursor = self.__getCursor()
        return self.testConnection(noDisconnect=True)

    def __getCursor(self) -> pyodbc.Cursor:
        return self.connection.cursor()

    def __disconnect(self) -> bool:
        '''
        Internal Disconnect Function
        ----------------------------
        Params: None
        Returns:
        - bool - True if disconnect successful, False if disconnect failed

        Attempts to disconnect from the database and reset the values of cursor, connection, and connectedUser
        '''
        try:
            if self.cursor is not None:
                self.cursor.close()
            if self.connection is not None:
                self.connection.close()

            self.cursor = None
            self.connection = None
            self.connectedUser = None

            if self.__logging:
                print(pt.importantTextMedium("Disconnected"))
        except:
            print(pt.importantTextBad(f"Failed to disconnect from {self.databaseName}@{self.serverName}"))

    def testConnection(self, username: str = None, noDisconnect:bool = False) -> bool:
        '''
        Test Connection Function
        ------------------------
        Params:
        - username: str - the username for the database - must be associate with as password in keyring - if not, will prompt for password. Defaults to None.
            - if None, will use the last connected user - will fail if no user has been connected
        '''
        try:
            if username is not None:
                self.__connect(username)
            elif self.connectedUser is None:
                print(pt.importantTextBad("No user connected! Please specify a username."))
                return False
            self.cursor = self.__getCursor()
            if self.__logging:
                print(pt.importantTextGood("Connection Successful!"))
            return True
        except pyodbc.Error:
            if self.__logging:
                print(pt.importantTextBad("Connection Failed!"))
            print
            return False
        finally:
            if not noDisconnect:
                self.__disconnect()

    def execute(self, command, username: str = None, noDisconnect: bool = False) -> Tuple[bool, List]:
        '''
        Main Execution Function
        -----------------------
        Params:
        - command: str - the SQL command to be executed
        - username: str - the username for the database - must be associate with as password in keyring - if not, will prompt for password. Defaults to None.
            - if None, will use the last connected user - will error if no user has been connected
        - noDisconnect: bool - if True, will not disconnect after execution - default FALSE

        Returns:
        - bool - True if execution successful, False otherwise
        - list - contents of the cursor after execution - None if execution failed
        '''

        if username is not None:
            if not self.__connect(username):
                return False
        elif self.cursor is None:
            print(pt.importantTextBad("No user connected! Please specify a username."))
            return False, None
        try:
            self.cursor.execute(command)
        except pyodbc.Error:
            print(pt.importantTextBad("Execution Failed!"))
            pyodbc.Error.__traceback__()
            return False, None
        return True, [x for x in self.cursor]
