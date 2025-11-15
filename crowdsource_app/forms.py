
from .models import Rating
from django import forms

class WaitLogForm(forms.Form):
    
    pass

class RatingForm(forms.ModelForm):
    
    class Meta:
        
        model = Rating
        fields=['score']
        widgets = {
            'score': forms.Select(choices=[(i,i) for i in range(1,6)])
        }