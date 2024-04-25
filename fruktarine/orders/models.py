from django.core.validators import RegexValidator
from django.db import models
from myapp.models import Product  # показывает ошибку, но работает


class Order(models.Model):
    name = models.CharField(max_length=100)
    phoneNumberRegex = RegexValidator(regex=r"^\+?1?\d{8,15}$")
    phone = models.CharField(validators=[phoneNumberRegex], max_length=16)
    address = models.CharField(max_length=250)
    date_delivery = models.DateField()
    comment = models.TextField()
    # city = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    # updated = models.DateTimeField(auto_now=True)
    paid = models.BooleanField(default=False)  # отметка об оплате заказа

    class Meta:
        ordering = ('-created',)
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return 'Order {}'.format(self.id)

    def get_total_cost(self):
        return sum(item.get_cost() for item in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=0)  # 0 знаков после запятой, для копеек поставить 2
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return '{}'.format(self.id)

    def get_cost(self):
        return self.price * self.quantity
