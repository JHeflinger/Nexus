redTerminalText = u"\u001b[31m"
greenTerminalBackground = u"\u001b[42m"
whiteTerminalText = u"\u001b[37;1m"
whiteTerminalBackground = u"\u001b[47m"
resetTerminal = u"\u001b[0m"
moveCursorDown = u'\u001b[1B'
moveCursorLeft = u'\u001b[1D'
reversedColor = u'\u001b[7m'
upOneLine = "\033[F"
space = " " * 20


class PrettyText:

    @staticmethod
    def importantTextBad(importantText: str) -> str:
        """Returns input string with white background and red text"""
        return redTerminalText + whiteTerminalBackground + importantText + resetTerminal

    @staticmethod
    def importantTextMedium(importantText: str) -> str:
        """Returns input string with inverted terminal BG and FG"""
        return reversedColor + importantText + resetTerminal

    @staticmethod
    def importantTextGood(importantText: str) -> str:
        """Returns the input string with white background and blue text"""
        return greenTerminalBackground + whiteTerminalText + importantText + resetTerminal
