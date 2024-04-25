from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product']


class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone', 'address', 'date_delivery',
                    'comment', 'paid', 'created']
    list_filter = ['paid', 'created', 'date_delivery']
    inlines = [OrderItemInline]


admin.site.register(Order, OrderAdmin)
