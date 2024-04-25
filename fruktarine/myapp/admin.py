from django.contrib import admin
from .models import Category, Product


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}  # для создания алиасов(slug) указываем поля, в которых значение
                                               # автоматически задается с использованием значения других полей


admin.site.register(Category, CategoryAdmin)


class ProductAdmin(admin.ModelAdmin):
    # Атрибут list_editable в классе ProductAdmin используется для задания полей, которые могут быть отредактированы
    # на странице отображения списка сайта администрирования. Это позволит редактировать несколько строк
    # одновременно. Любое поле в list_editable также должно быть указано в атрибуте list_display, поскольку могут
    # быть изменены только отображаемые поля.
    list_display = ['name', 'category', 'price', 'available']
    list_filter = ['name', 'available']
    list_editable = ['price', 'available']
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Product, ProductAdmin)
