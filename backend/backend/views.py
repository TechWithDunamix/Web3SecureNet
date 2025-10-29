from django.shortcuts import redirect
from django.conf import settings

def home_redirect(request):
    """
    Redirects to the frontend URL.
    """
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    return redirect(frontend_url)
