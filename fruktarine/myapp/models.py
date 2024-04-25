from django.db import models
from django.core.validators import RegexValidator
from django.urls import reverse


class Category(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, db_index=True, unique=True)  # URL-адрес

    class Meta:  # для изменения поведения полей модели
        ordering = ('name',)  # сортировка
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        # возвращаем уникальную ссылку каждый раз, когда обращаемся к методу объекта
        return reverse('myapp:product_list_by_category', args=[self.slug])


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='Товары')
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, db_index=True)  # URL-адрес
    image = models.ImageField(upload_to='products/', blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=0)  # 0 знаков после запятой, для копеек поставить 2
    # stock = models.PositiveIntegerField()  # для хранения остатков данного продукта
    available = models.BooleanField(default=True)  # доступность
    # created = models.DateTimeField(auto_now_add=True)  # дата и время создания
    # updated = models.DateTimeField(auto_now=True)  # дата и время последнего изменения

    """В классе Meta модели Product мы используем параметр мета index_together, чтобы задать индекс для полей id и 
    slug. Мы определим этот индекс, поскольку мы планируем запросить продукты с помощью id и slug. Оба поля 
    индексируются вместе для улучшения представлений для запросов, использующих эти два поля."""
    class Meta:
        ordering = ('name',)
        index_together = (('id', 'slug'),)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        # возвращаем уникальную ссылку каждый раз, когда обращаемся к методу объекта
        return reverse('myapp:product_detail', args=[self.id, self.slug])
