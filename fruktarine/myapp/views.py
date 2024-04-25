import os

from django.shortcuts import render, get_object_or_404
from .models import Category, Product
from cart.forms import CartAddProductForm  # Убрать/добавить .. чтобы не было ошибок
import json
from django.conf import settings
from rest_framework import serializers


class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


# def my_view(request):
#     data = MyModelSerializer(Product.objects.all(), many=True).data
#     return JsonResponse(data, safe=False)


def index(request):
    return render(request, 'myapp/base.html')


def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(available=True)
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)

    # записываем товары в файл json
    json_path = os.path.join('static', 'db', 'products.json')
    json_dict = MyModelSerializer(products, many=True).data
    with open(json_path, 'w') as f_json:
        json.dump({'products': json_dict}, f_json, indent=2)
    return render(request,
                  'myapp/product/list.html',
                  {'category': category,
                   'categories': categories,
                   'products': products})


def product_detail(request, id, slug):
    product = get_object_or_404(Product,
                                id=id,
                                slug=slug,
                                available=True)
    cart_product_form = CartAddProductForm()
    return render(request, 'myapp/product/detail.html',
                  {'product': product, 'cart_product_form': cart_product_form})


def page_not_found_view(request, exception):
    return render(request, '404.html', status=404)
