# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import db, initialize_app

app = initialize_app()

@https_fn.on_call()
def updateEvents(req: https_fn.CallableRequest) -> Any:
    uid = req.auth.uid

    events = db.