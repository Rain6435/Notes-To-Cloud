import keras_ocr
import jinja2
import pdfkit
import os
import time
import language_tool_python
import spacy

usersPath = "E:/Projects/NotesToCloud/Notes-To-Cloud/Backend/NoteToCloudBackEnd/Users"

tools = {
    "LTP": language_tool_python.LanguageTool("en-US"),
    "DTC": keras_ocr.detection.Detector(),
    "RCGN": keras_ocr.recognition.Recognizer(),
    "PPLN": keras_ocr.pipeline.Pipeline(),
}


def initialize():
    spacy.cli.download("en")
    tools["RCGN"].model.load_weights("../Model/reconModel.h5")
    tools["RCGN"].compile()
    tools["PPLN"] = keras_ocr.pipeline.Pipeline(tools["DTC"], tools["RCGN"])


def recognize(user, file):
    result = tools["PPLN"].recognize([usersPath + "/" + user + "/" + "Images/" + file])
    print(result)


def detectDuplicates(user):
    duplicates = []
    docFolder = os.listdir(usersPath + "/" + user + "/" + "Documents/PDF")
    for doc in docFolder:
        if doc == file[: len(file) - 4] + ".pdf":
            duplicates.append(doc)
    return duplicates


for user in os.listdir(usersPath):
    for file in os.listdir(usersPath + "/" + user + "/" + "Images"):
        detectDuplicates(user)
        recognize(user, file)

"""while 1:
    for user in os.listdir(usersPath):
        for file in os.listdir(usersPath+"/"+user+"/"+"Images"):
            
            
            if 

            else:
                
                
                s = []
                for r in result[0]:
                    s.append(r[0])
                grammarly = []
                for i in s:
                    p = ""
                    p += tools["LTP"].correct(" ".join(i))
                    if(i == len(s)-1):
                        grammarly.append(p)
                q = open(usersPath+"/"+user+"/Documents/TXT/"+file[:len(file)-4]+'.txt', "w")
                q.write(" ".join(grammarly))
                q.close()
                detectedText = " ".join(s)
                context = {'text': detectedText } # type: ignore
                template_loader = jinja2.FileSystemLoader('./')
                template_env = jinja2.Environment(loader=template_loader)
                try:
                    template = template_env.get_template('./PDFORM/template.html')
                    output_text = template.render(context)
                except:
                    print("here")

                template_loader = jinja2.FileSystemLoader('./')
                template_env = jinja2.Environment(loader=template_loader)
                template = template_env.get_template('./PDFORM/template.html')
                output_text = template.render(context)

                path = r'C:/Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
                config = pdfkit.configuration(wkhtmltopdf=path)
                pdfkit.from_string(output_text, usersPath+"/"+user+"/"+"Documents/PDF/"+file[:len(file)-4]+'.pdf', configuration=config,css="./PDFORM/style.css")
    
            if(len(os.listdir(usersPath+"/"+user+"/"+"Images"))==0):
                docs = os.listdir(usersPath+"/"+user+"/"+"Documents/PDF")
                for doc in docs:
                    os.remove(usersPath+"/"+user+"/"+"Documents/PDF/"+doc)
                texts = os.listdir(usersPath+"/"+user+"/"+"Documents/TXT")
                for text in texts:
                    os.remove(usersPath+"/"+user+"/"+"Documents/TXT/"+text)
    time.sleep(2)"""
