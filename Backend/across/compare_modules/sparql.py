module_list_query = """
SELECT ?moduleName ?moduleId ?moduleContent ?moduleURI ?module
WHERE {
    ?module <http://tuc.web.engineering/module#hasName> ?moduleName ;
            <http://tuc.web.engineering/module#hasModuleNumber> ?moduleId ;
            <http://tuc.web.engineering/module#hasContent> ?moduleContent .
}
"""


module_list_query_first_item_only = """
SELECT ?moduleContent
WHERE {
    ?module <http://tuc.web.engineering/module#hasContent> ?moduleContent .
   
}
LIMIT 1
"""

insert_module_similarity = "INSERT DATA { <%s>  <http://tuc.web.engineering/module#hasModules>  <%s> }"

insert_module_univeristy = "INSERT DATA { <%s>  <http://across/university#hasUniversity>  <%s> }"

insert_module_course = "INSERT DATA { <%s>  <http://tuc/course#hasCourse>  <%s> }"


