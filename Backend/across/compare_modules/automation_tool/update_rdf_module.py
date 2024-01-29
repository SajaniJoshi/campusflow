from rdflib import Graph, URIRef
from compare_modules.sparql import *

def add_predicate_for_module_similarity(universityOneModulesFile, univeristyTwoModulesFile, data_list_first, data_list_second, consumer):
    modulesTUC = Graph()
    modulesBialstok = Graph()
    modulesTUC.parse(universityOneModulesFile)
    modulesBialstok.parse(univeristyTwoModulesFile)
    consumer.send_message({"progress": 20 ,"type": 11 ,"message": "Starting to update RDF files:"})
    for similar_module in data_list_first:
       consumer.send_message({"progress": 30 , "type": 11, "message": f"Updating file"})
       list = similar_module['similar_modules']
       for item in list:
           uri = URIRef(item)
           modulesTUC.update(insert_module_similarity  % (similar_module.uri,uri))
           
    for similar_module in data_list_second:
       consumer.send_message({"progress": 40 ,"type": 11 ,"message": f"Updating file"})
       list = similar_module['similar_modules']
       for item in list:
           uri = URIRef(item)
           modulesBialstok.update(insert_module_similarity  % (similar_module.uri,uri))
    
    consumer.send_message({"progress": 50 ,"type": 11 , "message": "Finialising Results"})    
    fileOneContent = modulesTUC.serialize(format='xml')
    fileTwoContent = modulesBialstok.serialize(format='xml')

    new_file_name_1 = f"{universityOneModulesFile.split('.')[0]}_similar.rdf"
    new_file_name_2 = f"{univeristyTwoModulesFile.split('.')[0]}_similar.rdf"
    file1 = open(new_file_name_1, 'w')
    file2 = open(new_file_name_2, 'w')
    
    # Encode content to bytes using UTF-8
    fileOneContentBytes = fileOneContent.encode('utf-8')
    fileTwoContentBytes = fileTwoContent.encode('utf-8')

    consumer.send_message({"progress": 60 ,"type": 12 ,"message": "Almost Finished"})   

    with open(new_file_name_1, 'wb') as file1:
        file1.write(fileOneContentBytes)

    with open(new_file_name_2, 'wb') as file2:
        file2.write(fileTwoContentBytes)

    # file1.write(fileOneContent)
    # file2.write(fileTwoContent)
    consumer.send_message({"progress": 100 ,"type": 12 ,"message": f"Updating RDF files process finished successfully"})
    file1.close()
    file2.close()
