from django import forms
from .models import Order


class OrderCreateForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['name', 'phone', 'address', 'date_delivery', 'comment']

    name = forms.CharField(label="Ваши Фамилия Имя", widget=forms.TextInput(
                               attrs={'class': 'form-control', 'placeholder': 'Иванов Иван'}))
    phone = forms.CharField(label="Ваш телефон", widget=forms.TextInput(
        attrs={'class': 'form-control', 'placeholder': '+79870000000'}))
    address = forms.CharField(label="Адрес доставки или самовывоз", widget=forms.TextInput(
        attrs={'class': 'form-control', 'placeholder': 'Уфа, Пр.Октября 40/1 кв.100'}))
    date_delivery = forms.DateField(label="Дата доставки или самовывоза",
                                    widget=forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}))
    comment = forms.CharField(label="Комментарий", required=False, widget=forms.Textarea(
        attrs={'placeholder': 'Укажите пожелания по заказу, телефон и имя получателя, '
                              'если данные отличаются от заказчика, текст для открытки'}))
