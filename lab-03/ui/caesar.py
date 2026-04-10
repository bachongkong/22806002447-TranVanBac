from PyQt5 import QtCore, QtGui, QtWidgets
import os
os.environ['QT_QPA_PLATFORM_PLUGIN_PATH'] = "../platforms"

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(800, 600)

        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")

        # Title
        self.label = QtWidgets.QLabel("Caesar Cipher", self.centralwidget)
        self.label.setAlignment(QtCore.Qt.AlignCenter)
        font = QtGui.QFont()
        font.setPointSize(24)
        font.setBold(True)
        self.label.setFont(font)

        # Input Group
        self.input_group = QtWidgets.QGroupBox("Plain Text", self.centralwidget)
        self.txt_plaintext = QtWidgets.QTextEdit(self.input_group)

        layout_input = QtWidgets.QVBoxLayout()
        layout_input.addWidget(self.txt_plaintext)
        self.input_group.setLayout(layout_input)

        # Key Group
        self.key_group = QtWidgets.QGroupBox("Key", self.centralwidget)
        self.txt_key = QtWidgets.QTextEdit(self.key_group)
        self.txt_key.setFixedHeight(40)

        layout_key = QtWidgets.QVBoxLayout()
        layout_key.addWidget(self.txt_key)
        self.key_group.setLayout(layout_key)

        # Output Group
        self.output_group = QtWidgets.QGroupBox("Cipher Text", self.centralwidget)
        self.txt_ciphertext = QtWidgets.QTextEdit(self.output_group)

        layout_output = QtWidgets.QVBoxLayout()
        layout_output.addWidget(self.txt_ciphertext)
        self.output_group.setLayout(layout_output)

        # Buttons
        self.btn_encrypt = QtWidgets.QPushButton("Encrypt")
        self.btn_decrypt = QtWidgets.QPushButton("Decrypt")

        btn_layout = QtWidgets.QHBoxLayout()
        btn_layout.addStretch()
        btn_layout.addWidget(self.btn_encrypt)
        btn_layout.addWidget(self.btn_decrypt)
        btn_layout.addStretch()

        # Main Layout
        main_layout = QtWidgets.QVBoxLayout(self.centralwidget)
        main_layout.addWidget(self.label)
        main_layout.addSpacing(10)
        main_layout.addWidget(self.input_group)
        main_layout.addWidget(self.key_group)
        main_layout.addWidget(self.output_group)
        main_layout.addLayout(btn_layout)

        MainWindow.setCentralWidget(self.centralwidget)

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "Caesar Cipher"))

# Run
if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec_())
