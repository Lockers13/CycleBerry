from flask import Flask, render_template

app = Flask(__name__)

#Allows for changes without restarting the server#
#app.debug = True

@app.route('/')
def index():
	return render_template('home.html')

if __name__ == '__main__':
	app.run()