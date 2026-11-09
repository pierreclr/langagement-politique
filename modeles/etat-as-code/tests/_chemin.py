# -*- coding: utf-8 -*-
"""Rend `code/modele.py` importable depuis les tests (lancés avec python3 -I)."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "code"))
