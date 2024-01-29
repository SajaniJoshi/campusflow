import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .module_similarity import read_modules_and_compare
from os import listdir
from os.path import isfile, join

class Consumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(text_data=json.dumps({"progress": 1 , "message": "Converstion Started"}))
        onlyfiles = [f for f in listdir("uploads") if isfile(join("uploads", f))]
        read_modules_and_compare(f"uploads/{onlyfiles[0]}", f"uploads/{onlyfiles[1]}", self)
        # self.send({
        #     "type": "websocket.accept",
        # })
        # async_to_sync(self.channel_layer)('updates', self.channel_name) 
        # self.send({
        #     'type':'websocket.accept'
        # })

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        print(text_data)
        # self.send(text_data="Hello world!")
        # text_data_json = json.loads(text_data)
        # message = text_data_json["message"]

        # self.send(text_data=json.dumps({"message": message}))
    def send_message(self, value):
        
        # message = event['message']

        self.send(text_data=json.dumps(value))