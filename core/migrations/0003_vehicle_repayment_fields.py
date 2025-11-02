from django.db import migrations, models
from decimal import Decimal


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_kyc'),
    ]

    operations = [
        migrations.AddField(
            model_name='vehicle',
            name='repayment_duration',
            field=models.IntegerField(choices=[(12, '12'), (18, '18'), (24, '24')], null=True, blank=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='interest_rate',
            field=models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00')),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='total_receivable',
            field=models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00')),
        ),
    ]