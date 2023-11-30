# Generated by Django 4.2.6 on 2023-11-30 22:52

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_remove_developerprofile_skills_level_1_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='developerreview',
            name='rating',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MaxValueValidator(5)]),
        ),
    ]
