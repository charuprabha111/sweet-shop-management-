# backend/sweetshop/utils.py

def get_user_data(user):
    """
    Function to add the 'is_admin' status to the JWT login response.
    It uses the user's built-in is_staff status.
    """
    return {
        'is_admin': user.is_staff 
    }