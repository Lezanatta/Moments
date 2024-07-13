from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from datetime import datetime
from Comment import Comment
from Models import Moment
from moments_db import MomentsDb
import shutil
import os
from datetime import datetime
from fastapi.staticfiles import StaticFiles

app = FastAPI()

UPLOAD_DIRECTORY = "./uploads"

# Configurar CORS
# Configurar CORS
# Configurar CORS
origins = [
    "http://localhost:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "PUT", "DELETE"], 
    allow_headers=["*"], 
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIRECTORY), name="uploads")

def get_db():
    return MomentsDb()

@app.get("/{moment_id}")
def get(moment_id: int, resultados: MomentsDb = Depends(MomentsDb)):
     moment_data = resultados.obter_registros_id(moment_id)
     moment_data['comments'] = resultados.obter_comentarios_por_momento(moment_id)
     return {"message": "Sucesso", "data": moment_data}

@app.get("/")
def get(resultados=Depends(get_db)):
    data = resultados.obter_registros()
    return {"message": "Sucesso", "data": data}

@app.post("/add", status_code=201)
async def add(request: Request, resultados: MomentsDb = Depends(MomentsDb)):
    form = await request.form()

    moment_data = {
        "title": form.get("title"),
        "description": form.get("description"),
    }

    upload_file = form.get("image")

    if upload_file is not None:
        file_path = os.path.join(UPLOAD_DIRECTORY, upload_file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        moment_data["image"] = file_path

    moment_data["created_at"] = datetime.now().isoformat()

    new_moment_obj = Moment(**moment_data)

    resultados.adicionar_registro(new_moment_obj)

    return {"message": "Registro adicionado com sucesso", "moment": new_moment_obj}

@app.put("/")
async def edit(request: Request, resultados: MomentsDb = Depends(MomentsDb)):
    form = await request.form()

    moment_data = {
        "id": form.get("id"),
        "title": form.get("title"),
        "description": form.get("description"),
    }

    upload_file = form.get("image")

    if upload_file is not None:
        file_path = os.path.join(UPLOAD_DIRECTORY, upload_file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        moment_data["image"] = file_path

    new_moment_obj = Moment(**moment_data)

    resultados.editar_registro(new_moment_obj)


@app.delete("/{moment_id}")
def delete(moment_id: int, db_moments=Depends(get_db)):
    db_moments.remover_registro(moment_id)
    return {"Mensagem: Momento excluído com sucesso!"}


@app.post("/comment", status_code=201)
async def add(request: Request, db: MomentsDb = Depends(MomentsDb)):
    form = await request.form()

    moment_data = {
        "moment_id": form.get("moment_id"),
        "text": form.get("text"),
        "username": form.get("username"),
    }

    new_comment = Comment(**moment_data)

    db.adicionar_comentario(new_comment)


    return {"message": "Sucesso"}


