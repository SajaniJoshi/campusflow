import os
import json
import tempfile
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from compare_modules.views import create_course_entry_in_rdf
from pdf_To_rdf.tests import get_uniData, write_json_rdf

@csrf_exempt
@require_POST
def pdfToRdf(request):
    try:
        # Parse JSON data from the request body
        data = json.loads(request.POST.get('jsonData'))
        uploaded_files = request.FILES.getlist('files')
        # This will Make New Entry of Course in RDF of courses.rdf
        course_status = create_course_entry_in_rdf(data)  
        rdf_file_name = course_status["university_code"]+'_'+course_status["course_code"]
        
        # List to store the paths of saved files
        saved_file_paths = []        
        # This conditions states that course already exist and it will take existing course for comaparison
        if course_status['status'] == True:
            response_data = {
                        'message': course_status['message'],
                        'university_name': course_status['university_name'],
                        'rdf_File_Path': rdf_file_name
                    }
            return JsonResponse(response_data, status=200)
        else: # This follows that course doesn't exist and it will create new course in courses.rdf
            # Create a temporary directory to save the files
            temp_dir = tempfile.mkdtemp()
            uniData =  get_uniData(course_status['university_name'])

            for uploaded_file in uploaded_files:
                # Construct the file path where the file will be saved in the temporary directory
                file_path = os.path.join(temp_dir, uploaded_file.name)
                # If the file is stored in memory, read its content and write it to a file
                with open(file_path, 'wb') as f:
                    f.write(uploaded_file.read())
                    saved_file_paths.append(file_path)
                    write_json_rdf(file_path, course_status, rdf_file_name, uniData)
            response_data = {
                        'message': course_status['message'],
                        'university_name': course_status['university_name'],
                        'rdf_File_Path': rdf_file_name
                    }
            return JsonResponse(response_data, status=200)
    except Exception as e:
        return JsonResponse({'message': f'Error uploading and saving files: {str(e)}'}, status=500)
    finally:
        for file_path in saved_file_paths:
            os.remove(file_path)
        os.rmdir(temp_dir)
        print('End')



