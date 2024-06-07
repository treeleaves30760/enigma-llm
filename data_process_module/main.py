from flask import Flask, request, jsonify, make_response
import requests
from flask_cors import CORS, cross_origin  # 導入 CORS
import json
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
# 允許所有來自 localhost:3000 的請求
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# 暫時使用陣列儲存
documents = []

def load_datas_from_file():
    """從 JSON 檔案中加載 documents 列表"""
    try:
        with open('./documents/datas.json', 'r') as f:
            global documents
            documents = json.load(f)["document"]
        print("Documents loaded from file.")
        print(f'Documents: {documents}')
    except (FileNotFoundError, KeyError):
        print("No existing file or 'document' key not found. Starting with an empty list.")
        documents = []

def save_datas_to_file():
    """
    將 documents 列表存儲為 JSON 檔案
    """
    with open('./documents/datas.json', 'w') as f:
        json.dump({"document": documents}, f)
    print("Documents saved to file.")

scheduler = BackgroundScheduler()
scheduler.add_job(func=save_datas_to_file, trigger='interval', minutes=1)
scheduler.start()

@app.route('/process', methods=['POST', 'OPTIONS'])
@cross_origin()
def process_input():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    # 檢查是否有 'content' 
    if not request.json or 'content' not in request.json:
        return jsonify({'error': 'missing content'}), 400

    user_content = request.json['content']
    print(f'Content: {user_content}')
    
    system_prompt = '''The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. You should end your answer with +++.
Q:What is your name?+++
A:My name is LLM_TA+++
Q:'''

    prompt_data = {
        'prompt': system_prompt + user_content + '+++\A:',
        'n_predict': 1024,
        'stop': ['+++', 'Q:']
    }

    # 將資料 POST 到另一個本地伺服器
    response = requests.post('http://localhost:8080/completion', json=prompt_data)
    print(f'response: {response}')
    
    if response.status_code != 200:
        return jsonify({'error': 'failed to process data'}), 500

    response_content = response.json()['content']
    print(response_content)
    # 直接使用 jsonify 回傳結果到前端
    return jsonify({'content': response_content})

@app.route('/add_document', methods=['POST', 'OPTIONS'])
@cross_origin()
def add_document():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or 'content' not in request.json:
        return jsonify({'error': 'missing content'}), 400

    user_content = request.json['content']
    print(f'Content: {user_content}')
    documents.append(user_content)
    
    return jsonify({'message': 'document added'})

@app.route('/get_documents', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_documents():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    print(f'Documents: {documents}')
    return jsonify({'documents': documents})

@app.route('/update_document', methods=['POST', 'OPTIONS'])
@cross_origin()
def update_document():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or 'new_content' not in request.json or 'old_content' not in request.json:
        return jsonify({'error': 'missing content'}), 400

    new_content = request.json['new_content']
    old_content = request.json['old_content']
    print(f'Old Content: {old_content}')
    print(f'New Content: {new_content}')
    if old_content in documents:
        documents.remove(old_content)
        documents.append(new_content)
    
    return jsonify({'message': 'document updated'})

@app.route('/delete_document', methods=['POST', 'OPTIONS'])
@cross_origin()
def delete_document():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or 'content' not in request.json:
        return jsonify({'error': 'missing content'}), 400

    user_content = request.json['content']
    print(f'Content: {user_content}')
    if user_content in documents:
        documents.remove(user_content)
    
    return jsonify({'message': 'document removed'})

@app.route('/clear_documents', methods=['GET', 'OPTIONS'])
@cross_origin()
def clear_documents():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    documents.clear()
    return jsonify({'message': 'documents cleared'})


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

if __name__ == '__main__':
    load_datas_from_file()
    app.run(debug=True, port=5000)
