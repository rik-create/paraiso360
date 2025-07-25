# paraiso360_backend/apps/inventory/lots/serializers.py

## How to Add Business Rules in LotSerializer (Django REST Framework)

---

### ✅ Example: Add More Business Rules

```python
def validate(self, attrs):
    new_status = attrs.get('status')
    instance = getattr(self, 'instance', None)

    # Example 1: prevent re-marking as sold
    if instance and new_status == 'Sold':
        if instance.status == 'Sold':
            raise serializers.ValidationError({
                'status': 'Lot is already sold and cannot be marked sold again.'
            })

    # Example 2: prevent changing to "Available" if it has a client assigned
    if instance and new_status == 'Available' and instance.client is not None:
        raise serializers.ValidationError({
            'status': 'Lot has a client assigned and cannot be marked available.'
        })

    # Example 3: don't allow clearing location
    if 'location' in attrs and attrs['location'] is None:
        raise serializers.ValidationError({
            'location': 'Location cannot be empty.'
        })

    return super().validate(attrs)
```

---

### ✅ How to Add New Rules

1. **Put all logic inside `validate()` in `LotSerializer`**
2. You have full access to:

   - `attrs` → new data
   - `self.instance` → current db data

3. Return `super().validate(attrs)` at the end

---

### ✅ Tip for Complex Conditions

If you want to split logic per field:

```python
def validate_status(self, value):
    if self.instance and self.instance.status == 'Sold' and value == 'Sold':
        raise serializers.ValidationError('Already sold.')
    return value
```

You can combine that with `validate()`.

---
