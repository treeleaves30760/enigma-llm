import json
from flask import Flask, request, jsonify, make_response
import time
import requests
from flask_cors import CORS, cross_origin  # 導入 CORS
import chromadb

DB_PATH = "./DB"
DEBUG_MODE = True
COLLECTION_NAME = "Documents"
LLAMA_CPP_URL = "http://127.0.0.1:8080"
HOST_NAME = "127.0.0.1"
PORT = 5000


chroma_client = chromadb.PersistentClient(path=DB_PATH)
collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
)


@app.route("/submit", methods=["POST"])
def submit_prompt():
    """
    This is a content process function
    1. Catch the user's input
    2. Send to DB and query the data
    3. Send to LLM with user's input and queried data
    4. return to user website.
    """
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 從請求中獲取提示詞
    user_question = request.json.get("prompt")
    if not user_question:
        return jsonify({"error": "No prompt provided"}), 400

    n_result = 2
    if "n_result" in request.json:
        n_result = request.json["n_result"]

    show_mode = request.json.get("show_mode")
    if not show_mode:
        show_mode = "full"

    # 從DB中查詢數據
    results = collection.query(query_texts=[user_question], n_results=n_result)
    data_for_llama = ""
    if results["documents"][0]:
        data_for_llama += "\n".join(results["documents"][0])

    # 向Llama.cpp服務器發送POST請求
    # 確認目前是否有空閒的序列
    for i in range(10):
        s = requests.get(f"{LLAMA_CPP_URL}/health", timeout=10)

        if DEBUG_MODE:
            print(f"|DEBUG|{time.time()}|Attempt {i + 1}: {s.json()}")

        if s.json()["status"] == "ok":
            break
        time.sleep(1)
    else:
        return jsonify({"error": "No available sequence"}), 500

    final_prompt = f"""The following is a conversation with an AI assistant. 
The assistant is helpful, creative, clever, and very friendly.
You must add +++ at the end of your answer.
<data>
{data_for_llama}
</data>

Q:What's your name?+++
A:My name is Engima-LLM, a lightweight LLM-RAG system.+++
Q:{user_question}+++
A:"""
    if DEBUG_MODE:
        print(f"|DEBUG|{time.time()}|Final prompt: {final_prompt}")
    # 向llama.cpp服務器發送POST請求
    # 構建parameter dict
    parameter = {
        "prompt": final_prompt,
        "n_predict": 1024,
        "temperature": 0,
        "stop": ["+++", "Q:"],
    }
    response = requests.post(
        f"{LLAMA_CPP_URL}/completion", json=parameter, timeout=1000
    )
    if response.status_code == 200:
        # 處理成功，進行數據提取
        content = response.json()["content"]
        if DEBUG_MODE:
            print(f"|DEBUG|{time.time()}|content: {content}")
        return jsonify({"content": content})
    # 處理失敗，返回錯誤信息
    return jsonify({"error": "Failed to get response from llama.cpp server"}), 500


@app.route("/add_document", methods=["POST", "OPTIONS"])
@cross_origin()
def add_document():
    """
    Add a document to the documents list.
    """
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or "content" not in request.json or "id" not in request.json:
        return jsonify({"error": "missing content"}), 400

    user_content = request.json["content"]
    user_id = request.json["id"]
    print(f"Content: {user_content}")

    collection.add(documents=user_content, ids=[user_id])

    return jsonify({"message": "document added"})


@app.route("/get_documents", methods=["GET", "OPTIONS"])
@cross_origin()
def get_documents():
    """
    Get all documents in the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    results = collection.get()
    print(f"Results: {results}")
    return jsonify({"documents": results["documents"], "ids": results["ids"]})


@app.route("/update_document", methods=["POST", "OPTIONS"])
@cross_origin()
def update_document():
    """
    Update a document in the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json:
        return jsonify({"error": "can't parse request"}), 400

    if "new_content" not in request.json:
        return jsonify({"error": "missing new_content"}), 400
    if "old_id" not in request.json:
        return jsonify({"error": "missing old_id"}), 400
    if "new_id" not in request.json:
        return jsonify({"error": "missing new_id"}), 400

    new_content = request.json["new_content"]
    new_content_id = request.json["new_id"]
    old_content_id = request.json["old_id"]
    print(f"Old ID: {old_content_id}")
    print(f"New Content: {new_content}, New ID: {new_content_id}")

    collection.delete(ids=[old_content_id])
    collection.add(documents=new_content, ids=[new_content_id])

    return jsonify({"message": "document updated"})


@app.route("/delete_document", methods=["POST", "OPTIONS"])
@cross_origin()
def delete_document():
    """
    Delete a document from the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or "content" not in request.json:
        return jsonify({"error": "missing content"}), 400

    user_content = request.json["content"]
    user_content_id = request.json["id"]
    print(f"Content: {user_content}, ID: {user_content_id}")

    collection.delete(ids=[user_content_id])
    return jsonify({"message": "document removed"})


############################################################
# The below APT is dangerous, it will clear all documents. #
# Please comment it out before running the server public.  #
# Not recommended to use in production.                    #
# 以下的 API 是危險的，它會清除所有文件。                        #
# 請在運行服務器之前將其註釋掉。                                #
# 不建議在生產環境中使用。                                     #
############################################################

# @app.route('/clear_documents', methods=['GET', 'OPTIONS'])
# @cross_origin()
# def clear_documents():
#     """
#     Clear all documents from the documents list.
#     """

#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
#     chroma_client.reset()
#     return jsonify({'message': 'documents cleared'})


@app.route("/query_document", methods=["POST", "OPTIONS"])
@cross_origin()
def query_document():
    """
    Query a document from the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or "content" not in request.json:
        return jsonify({"error": "missing content"}), 400

    n_result = 2
    if "n_result" in request.json:
        n_result = request.json["n_result"]

    user_content = request.json["content"]
    print(f"Content: {user_content}")
    results = collection.query(query_texts=[user_content], n_results=n_result)
    print(f"Results: {results}")

    return jsonify({"results": results})


def _build_cors_preflight_response():
    """
    Builds a CORS preflight response.
    """

    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response


if __name__ == "__main__":
    app.run(host=HOST_NAME, debug=True, port=PORT)
