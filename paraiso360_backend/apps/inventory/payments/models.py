# payments/infrastructure/models.py
from django.db import models

class Payment(models.Model):
    """
    Represents a financial transaction related to a lot.
    """
    class Status(models.TextChoices):
        PAID = 'Paid', 'Paid'
        PENDING = 'Pending', 'Pending'
        OVERDUE = 'Overdue', 'Overdue'

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="The amount of the payment."
    )
    payment_date = models.DateTimeField(
        auto_now_add=True,
        help_text="The timestamp when the payment record was created."
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        help_text="The current status of the payment."
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Any relevant notes about the payment."
    )

    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name='payments',
        help_text="The client who made the payment."
    )
    lot = models.ForeignKey(
        'lots.Lot',
        on_delete=models.RESTRICT,
        related_name='payments',
        help_text="The lot this payment is for."
    )

    due_date = models.DateField(
    help_text="The date when the payment is due.",
    blank=True,
    null=True
    )

    class PaymentMethod(models.TextChoices):
        CASH = 'Cash', 'Cash'
        GCASH = 'GCash', 'GCash'
        CARD = 'Card', 'Card'

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CASH,
        help_text="The method used to make the payment."
    )

    def is_overdue(self):
        from datetime import date
        return self.status != self.Status.PAID and self.due_date < date.today()


    class Meta:
        db_table = 'payment'
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        ordering = ['-payment_date']

    def __str__(self):
        return f"Payment of {self.amount} for {self.lot} by {self.client}"