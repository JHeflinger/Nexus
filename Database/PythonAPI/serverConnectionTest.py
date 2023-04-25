from dbUtils import Server


def main() -> None:
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    print("Testing connection for user: consaljj")
    connectionSuccess = Nexus.testConnection("consaljj")
    if not connectionSuccess:
        print("Connection failed, exiting...")
        return
    print("Testing execution of 'SELECT * FROM dbo.Document'")
    success, result = Nexus.execute("SELECT * FROM dbo.Document", username="consaljj")
    if success:
        print("Success!")
        print(result)

if __name__ == "__main__":
    main()