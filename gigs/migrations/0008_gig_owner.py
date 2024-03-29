# Generated by Django 4.2.7 on 2024-02-08 16:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gigs', '0007_alter_gig_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='gig',
            name='owner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='gig', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
