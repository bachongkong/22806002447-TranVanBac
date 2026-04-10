from flask import Flask, render_template, request, json
from cipher.caesar import CaesarCipher
from cipher.vigenere import VigenereCipher
from cipher.railfence import RailFenceCipher
from cipher.playfair import PlayFairCipher
from cipher.transposition import TranspositionCipher

app = Flask(__name__)

# Router cho trang chủ
@app.route("/")
def home():
    return render_template('index.html')


# ------------------ CAESAR ------------------
@app.route("/caesar", methods=["GET", "POST"])
def caesar():
    result = ""
    error = ""
    if request.method == "POST":
        text = request.form["text"]
        key = request.form["key"]
        if not key.isdigit():
            error = "Key must be an integer."
        else:
            key = int(key)
            cipher = CaesarCipher()
            if "encrypt" in request.form:
                result = cipher.encrypt_text(text, key)
            elif "decrypt" in request.form:
                result = cipher.decrypt_text(text, key)
    return render_template("caesar.html", result=result, error=error)

# ------------------ VIGENÈRE ------------------
@app.route("/vigenere", methods=["GET", "POST"])
def vigenere():
    result = ""
    error = ""
    if request.method == "POST":
        text = request.form["text"]
        key = request.form["key"]
        cipher = VigenereCipher()

        if not key.isalpha():
            error = "Key must contain only alphabetic characters (A-Z, a-z)."
        else:
            if "encrypt" in request.form:
                result = cipher.vigenere_encrypt(text, key)
            elif "decrypt" in request.form:
                result = cipher.vigenere_decrypt(text, key)

    return render_template("vigenere.html", result=result, error=error)


# ------------------ RAIL FENCE ------------------
@app.route("/railfence", methods=["GET", "POST"])
def railfence():
    result = ""
    error = ""
    if request.method == "POST":
        text = request.form["text"]
        key = request.form["key"]
        if not key.isdigit() or int(key) < 2:
            error = "Key must be an integer ≥ 2."
        else:
            key = int(key)
            cipher = RailFenceCipher()
            if "encrypt" in request.form:
                result = cipher.rail_fence_encrypt(text, key)
            elif "decrypt" in request.form:
                result = cipher.rail_fence_decrypt(text, key)
    return render_template("railfence.html", result=result, error=error)

# ------------------ PLAYFAIR ------------------
@app.route("/playfair", methods=["GET", "POST"])
def playfair():
    result = ""
    error = ""
    if request.method == "POST":
        text = request.form["text"]
        key = request.form["key"]
        if not key.isalpha():
            error = "Key must contain only alphabetic characters (A–Z)."
        else:
            cipher = PlayFairCipher()
            if "encrypt" in request.form:
                result = cipher.playfair_encrypt(text, key)
            elif "decrypt" in request.form:
                result = cipher.playfair_decrypt(text, key)
    return render_template("playfair.html", result=result, error=error)

# ------------------ TRANSPOSITION ------------------
@app.route("/transposition", methods=["GET", "POST"])
def transposition():
    result = ""
    error = ""
    if request.method == "POST":
        text = request.form["text"]
        key = request.form["key"]
        if not key.isdigit() or int(key) < 2:
            error = "Key must be an integer ≥ 2."
        else:
            key = int(key)
            cipher = TranspositionCipher()
            if "encrypt" in request.form:
                result = cipher.encrypt(text, key)
            elif "decrypt" in request.form:
                result = cipher.decrypt(text, key)
    return render_template("transposition.html", result=result, error=error)

# Chạy ứng dụng
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
