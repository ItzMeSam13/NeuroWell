import google.generativeai as genai

genai.configure(api_key="AIzaSyAJFnkMklqqLygOguR0RZYstW3TSPQpa1w")

for m in genai.list_models():
    print(m.name)