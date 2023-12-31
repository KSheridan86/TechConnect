# Generated by Django 4.2.6 on 2023-11-14 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_developerprofile_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='developerprofile',
            name='skills_level_1',
            field=models.ManyToManyField(blank=True, related_name='level_1_skills', to='api.skill'),
        ),
        migrations.AlterField(
            model_name='developerprofile',
            name='skills_level_2',
            field=models.ManyToManyField(blank=True, related_name='level_2_skills', to='api.skill'),
        ),
    ]
