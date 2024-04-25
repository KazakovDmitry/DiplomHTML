from django.shortcuts import render
from .models import OrderItem
from .forms import OrderCreateForm
from cart.cart import Cart
from .telegram import send_by_telegram


def order_create(request):
    cart = Cart(request)
    if request.method == 'POST':
        form = OrderCreateForm(request.POST)
        if form.is_valid():
            order = form.save()
            message = f'Поступил новый заказ номер {order.id}:\n'
            for item in cart:
                OrderItem.objects.create(order=order,
                                         product=item['product'],
                                         price=item['price'],
                                         quantity=item['quantity'])
                message = message + f"{item['product']} {item['price']} x {item['quantity']} = {item['total_price']}р.\n"
            # уведомление в телеграм
            message = message + (f'Заказчик: {order.name}\nТелефон: {order.phone}\n'
                                 f'Адрес доставки: {order.address}\n'
                                 f'Дата доставки: {order.date_delivery.strftime("%d.%m.%Y")}\n'
                                 f'Комментарий: {order.comment}\nИтого: {order.get_total_cost()}р.')

            # очистка корзины
            cart.clear()
            send_by_telegram(message)
            return render(request, 'orders/order/created.html',
                          {'order': order})
    else:
        form = OrderCreateForm
    return render(request, 'orders/order/create.html',
                  {'cart': cart, 'form': form})
