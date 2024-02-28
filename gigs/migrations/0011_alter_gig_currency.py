# Generated by Django 4.2.7 on 2024-02-13 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gigs', '0010_alter_gig_currency_alter_gig_price_alter_gig_setlist'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gig',
            name='currency',
            field=models.CharField(blank=True, choices=[('USD', '$'), ('EUR', '€'), ('GBP', '£'), ('JPY', '¥'), ('CNY', '¥'), ('AUD', '$'), ('CAD', '$'), ('CHF', 'CHF'), ('SEK', 'kr'), ('NZD', '$'), ('KRW', '₩'), ('SGD', '$'), ('NOK', 'kr'), ('MXN', '$'), ('INR', '₹'), ('RUB', '₽'), ('ZAR', 'R'), ('BRL', 'R$'), ('TRY', '₺'), ('HKD', '$'), ('IDR', 'Rp'), ('TWD', 'NT$'), ('THB', '฿'), ('PHP', '₱'), ('MYR', 'RM')], default='USD', max_length=50),
        ),
    ]