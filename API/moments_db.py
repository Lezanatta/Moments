from fastapi import HTTPException
import sqlite3

from Comment import Comment
from Models import Moment

class MomentsDb:
    def __init__(self, db_path: str = 'moments.db'):
        self.db_path = db_path

    def get_db_connection(self):
        return sqlite3.connect(self.db_path)

    def obter_registros(self):
        connect = self.get_db_connection()
        cursor = connect.cursor()
        cursor.execute('SELECT * FROM moments')
        moments = cursor.fetchall()
        
        column_names = [desc[0] for desc in cursor.description]
        
        moments_list = [dict(zip(column_names, moment)) for moment in moments]
        
        connect.commit()
        connect.close()
        return moments_list

    
    def obter_registros_id(self, moment_id: int):
        try:
            connect = self.get_db_connection()
            cursor = connect.cursor()
            cursor.execute('SELECT * FROM moments WHERE id = ?', (moment_id,))
            moment = cursor.fetchone()

            if not moment:
                raise HTTPException(status_code=404, detail="Momento não encontrado")
            
            column_names = [desc[0] for desc in cursor.description]
            
            moment_dict = dict(zip(column_names, moment))
            
            connect.commit()
            connect.close()
            
            return moment_dict

        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail=f"Erro ao obter momento por ID: {e}")

    def adicionar_registro(self, moment: Moment):
        connect = self.get_db_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM moments")
        next_id = cursor.fetchone()[0]       
        cursor.execute("""
            INSERT INTO moments (id, title, description, image, created_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        """, (next_id, moment.title, moment.description, moment.image))
        connect.commit()
        connect.close()

    def editar_registro(self, moment: Moment):
        connect = self.get_db_connection()
        cursor = connect.cursor()
        
        query = """
            UPDATE moments SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
        """
        parameters = [moment.title, moment.description]

        if moment.image:
            query += ", image = ?"
            parameters.append(moment.image)
        
        query += " WHERE id = ?"
        parameters.append(moment.id)

        print(query)

        cursor.execute(query, parameters)
        
        connect.commit()
        connect.close()

    
    def remover_registro(self, moment_id: int):
        try:
            connect = self.get_db_connection()
            cursor = connect.cursor()
            cursor.execute("DELETE FROM moments WHERE id = ?", (moment_id,))
            connect.commit()
            connect.close()

        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail="Erro interno ao deletar momento")
        

    def adicionar_comentario(self, comment: Comment):
        connect = self.get_db_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM Comments")
        next_id = cursor.fetchone()[0]       
        cursor.execute("""
            INSERT INTO comments (id, text, username, moment_id)
            VALUES (?, ?, ?, ?)
        """, (next_id, comment.text, comment.username, comment.moment_id))
        connect.commit()
        connect.close()

    def obter_comentarios_por_momento(self, moment_id: int):
        try:
            connect = self.get_db_connection()
            cursor = connect.cursor()
            cursor.execute('SELECT * FROM comments WHERE moment_id = ?', (moment_id,))
            comments = cursor.fetchall()

            if not comments:
                return [] 

            column_names = [desc[0] for desc in cursor.description]
            comments_list = [dict(zip(column_names, comment)) for comment in comments]

            connect.close()
            
            return [Comment(**comment_data) for comment_data in comments_list]

        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail=f"Erro ao obter comentários por momento ID: {e}")