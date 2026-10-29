' Inicia o agente da Central sem janela. Usado pelo atalho da pasta Inicializar.
' Log em agent\data\agente.log. Se o agente ja estiver rodando, esta copia sai sozinha (porta ocupada).
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName))
If Not fso.FolderExists(dir & "\data") Then fso.CreateFolder(dir & "\data")
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = dir
sh.Run "cmd /c node src\index.js >> data\agente.log 2>&1", 0, False
