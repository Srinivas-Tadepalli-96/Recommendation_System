from flask import Blueprint,jsonify, request
from flask_restful import Api,Resource
import pandas as pd
from werkzeug.utils import secure_filename

import pickle
import sys 
import os
import json
from tensorflow.keras.models import load_model

dirname = os.path.dirname(os.path.abspath(__file__))
dirname_list = dirname.split("/")[:-1]
dirname = "/".join(dirname_list)
print(dirname)
path = dirname + "/api"
print(path)
sys.path.append(path)


mod = Blueprint('api',__name__)
api = Api(mod)
df = None

df_path = dirname + "/Data" + "/final_data.csv"
new_df = pd.read_csv(df_path)

product_category_model = load_model(path + '/product_category_model.h5',compile=False)
seller_id_model = load_model(path + '/seller_id_model.h5',compile=False)
product_id_model = load_model(path + '/product_id_model.h5',compile=False)

# seller_dict
pickle_in=open(path + "/seller_dict.pickle","rb")
seller_dict=pickle.load(pickle_in)

#product id
pickle_in=open(path + "/product_dict.pickle","rb")
product_dict=pickle.load(pickle_in)

# product_category_dict
pickle_in=open(path + "/product_category_dict.pickle","rb")
product_category_dict=pickle.load(pickle_in)

def prob_to_class(test_list):
    #test_list=predictions1[0]
    N = 10
    res = sorted(range(len(test_list)), key = lambda sub: test_list[sub])[-N:] 
    
    return res
    
def Final_List(classes,dictionary):
    my_list = list()
    for index in range(len(classes)):
        var = classes[index]
        result = dictionary[var]
        my_list.append(result)
        
    return my_list

class Get_Data(Resource):
    def post(self):
        try:
            postedData=request.get_json()
            
            customer_id=postedData['customer_id']

            data = new_df.loc[new_df['customer_id'] == customer_id]

            print(data)

            pred_data = data[['product_price', 'freight_value', 'review_score', 'seller_lat',
            'sellet_lng', 'customer_lat', 'customer_lng']]

            pred_product_category_model = product_category_model.predict(pred_data)
            
            pred_seller_id_model = seller_id_model.predict(pred_data)
            
            pred_product_id_model = product_id_model.predict(pred_data)

            classes_product_category = prob_to_class(pred_product_category_model[0])

            classes_seller_id = prob_to_class(pred_seller_id_model[0])

            classes_product_id = prob_to_class(pred_product_id_model[0])

            predictions_product_category = Final_List(classes_product_category,product_category_dict)

            predictions_seller_id = Final_List(classes_seller_id,seller_dict)

            predictions_product_id = Final_List(classes_product_id,product_dict)

            
            retJson = {"status":200,"Product_Categories":predictions_product_category,"Seller_Id":predictions_seller_id,"Product_Id":predictions_product_id}
            return jsonify(retJson)

        except Exception as e:
            print(e)
            ret={"status":401,"message":"Cannot import the data","Problem":e}         
            return jsonify(ret)

api.add_resource(Get_Data, "/recommendations")
