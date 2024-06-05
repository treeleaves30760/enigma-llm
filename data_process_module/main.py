from flask import Flask, request, jsonify, make_response
import requests
from flask_cors import CORS, cross_origin  # 導入 CORS

app = Flask(__name__)
# 允許所有來自 localhost:3000 的請求
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

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

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)
