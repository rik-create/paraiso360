# Generated by Django 5.2.4 on 2025-07-19 12:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clients', '0001_initial'),
        ('lots', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, help_text='The amount of the payment.', max_digits=12)),
                ('payment_date', models.DateTimeField(auto_now_add=True, help_text='The timestamp when the payment record was created.')),
                ('status', models.CharField(choices=[('Paid', 'Paid'), ('Pending', 'Pending'), ('Overdue', 'Overdue')], default='Pending', help_text='The current status of the payment.', max_length=20)),
                ('notes', models.TextField(blank=True, help_text='Any relevant notes about the payment.', null=True)),
                ('client', models.ForeignKey(help_text='The client who made the payment.', on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='clients.client')),
                ('lot', models.ForeignKey(help_text='The lot this payment is for.', on_delete=django.db.models.deletion.RESTRICT, related_name='payments', to='lots.lot')),
            ],
            options={
                'verbose_name': 'Payment',
                'verbose_name_plural': 'Payments',
                'db_table': 'payment',
                'ordering': ['-payment_date'],
            },
        ),
    ]
