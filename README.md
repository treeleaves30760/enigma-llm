# Enigma LLM

This LLM-RAG project uses Next.js + shadcn-ui + python(flask + chromadb). Aim to create a lightweight RAG framework.

## Key Features

* **Document Upload & Management:** Easily upload personal documents (markdown format) and manage/delete them within the interface.
* **Vectorization & Storage:** Utilizes a Python backend (Flask, ChromaDB) to convert documents into vectors and store them in a vector database for efficient semantic search.
* **Question Answering:** Ask questions in natural language, and the system will generate relevant and informative answers based on your documents, powered by an LLM (Large Language Model).
* **User-Friendly Interface:** Built with Next.js and Shadcn UI for an intuitive and aesthetically pleasing experience.
* **Customization:** Adjust LLM model, vectorization methods, and other settings to suit your needs.

## Getting Started

> [!NOTE]
> You need to run the llama.cpp server
> You can refer to [here](https://github.com/ggerganov/llama.cpp) for more information
> We consider to add a local start service in future.

First, run the development server:

```bash
npm install
npm run dev
```

Second, run the data process server:

```bash
cd data_process_module
conda create -n llm_ta python==3.11
conda activate llm_ta
pip install -r requirements.txt
```

Finally, run the backend server:

```bash
python main.py
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

You can add your personal documents in documents page, and ask question in Home page
