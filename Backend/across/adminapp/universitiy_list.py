import json
from .sparql import *
from pymantic import sparql


def get_all_universities(request):
    server = sparql.SPARQLServer('http://10.57.14.199:9999/blazegraph/sparql')

    qresponse = server.query(university_list_query)
    data_list = []
    data = qresponse['results']['bindings']
    
    for row in data:
        data_dict = {
            'id': str(row['hasUniversityId']['value']),
            'name': str(row['universityName']['value']),
            'uri': str(row['university']['value']),
        }
        data_list.append(data_dict)
    return data_list
