from flask import Flask, request, jsonify
import requests
from flask_cors import CORS  # 導入 CORS

app = Flask(__name__)
CORS(app)  # 啟用 CORS

@app.route('/process', methods=['POST'])
def process_input():
    # 檢查是否有 'content' 
    if not request.json or 'content' not in request.json:
        return jsonify({'error': 'missing content'}), 400
    
    # 從請求中獲取 'content'
    user_content = request.json['content']
    print(f'Content: {user_content}')
    
    system_prompt = '''The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. You should end you answer with +++.
    Q:What is your name?+++
    A:My name is LLM_TA+++
    Q:'''
    
    # 添加 RAG 資料
    prompt_data = {
        'prompt': system_prompt + user_content + '+++',
        'n_predict': 1024,
        'stop': ['+++', 'Q:']
    }
    
    # 將資料 POST 到另一個本地伺服器
    response = requests.post('http://localhost:8080/completion', json=prompt_data)
    print(f'response: {response}')
    # 檢查從第二個伺服器獲得的回應
    if response.status_code != 200:
        return jsonify({'error': 'failed to process data'}), 500
    
    
    response_content = response.json()['content']
    print(response_content)
    
    response_front = jsonify({'content': response_content})
    # 回傳結果到前端
    return response_front

if __name__ == '__main__':
    app.run(debug=True, port=5000)
