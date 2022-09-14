from flask import Flask, request, redirect
from flask_restful import Resource, Api
from flask_cors import CORS
import os
# import prediction
import dataPrediction as prediction
from keras.models import load_model
from PIL import Image, ImageOps
import numpy as np

ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg']
UPLOAD_FOLDER = './upload'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)

def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class Test(Resource):
    def get(self):
        return 'Welcome to, Pet Disease API!'
    
    def post(self):
        try:
            value = request.get_json()
            if(value):
                return {'Post Values': value}, 201
            
            return {"error":"Invalid format."}
            
        except Exception as error:
            return {'error': error}

class GetAIDetectionOutput(Resource):
    def get(self):
        return {"error":"Invalid Method."}

    def post(self):
        file_to_upload = request.files['file']

        if file_to_upload.filename == '':
            print('No selected file')
            return redirect(request.url)

        if not allowed_file(file_to_upload.filename):
            return {"error":"Invalid image file format."}

        try:
            path = os.path.join(app.config['UPLOAD_FOLDER'], file_to_upload.filename)
            file_to_upload.save(path)

            model = load_model('keras_model.h5')
            data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)

            image = Image.open(path)
            size = (224, 224)
            image = ImageOps.fit(image, size, Image.ANTIALIAS)

            image_array = np.asarray(image)
            normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
            data[0] = normalized_image_array

            prediction = model.predict(data)

            if float(prediction[0][1]) > 0.5:
                predictionValue = "CanineLupus"
                diseasePercentage = float(prediction[0][1]) * 100
            else:
                predictionValue = "CanineImpetigo"
                diseasePercentage = float(prediction[0][0]) * 100

            return {
                'prediction' : predictionValue,
                'diseasePercentage': diseasePercentage
            }

        except Exception as error:
            return {'error': error}

class GetPredictionOutput(Resource):
    def get(self):
        return {"error":"Invalid Method."}

    def post(self):
        try:
            print(request)
            data = request.get_json()
            print(data)
            predictData = []
            for x in data:
                predictData.append(x["name"])
            predict = prediction.predict_mpg(predictData)
            return {'predict':predict}

        except Exception as error:
            return {'error': error}

api.add_resource(Test,'/')
api.add_resource(GetAIDetectionOutput,'/getAIDetectionOutput')
api.add_resource(GetPredictionOutput,'/getPredictionOutput')

if __name__ == '__main__':
    app.run(debug=True)
