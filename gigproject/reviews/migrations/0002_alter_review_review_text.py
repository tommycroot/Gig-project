# Generated by Django 4.2.7 on 2024-02-20 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='review_text',
            field=models.CharField(default=0, max_length=280),
        ),
    ]