.PHONY: all
all:
	npm install
	npm run vscode:prepublish
	vsce package -o mta-vscode-extension.vsix
	mv mta-vscode-extension.vsix ~/dev/l2c-operator/build/vscode/mta-vscode-extension.vsix
