import importlib.util
import pathlib
import unittest
import numpy as np

spec=importlib.util.spec_from_file_location('sound_library',pathlib.Path(__file__).parents[1]/'scripts'/'sound_library.py')
lib=importlib.util.module_from_spec(spec);spec.loader.exec_module(lib)
class SoundTests(unittest.TestCase):
 def test_unique_bounded_reproducible_sounds(self):
  fingerprints=set()
  for family in lib.FAMILIES:
   for variant in range(3):
    wave=lib.synthesize(family,variant)
    self.assertTrue(np.isfinite(wave).all())
    self.assertLessEqual(np.max(np.abs(wave)),.5)
    self.assertGreater(np.max(np.abs(wave)),.01)
    self.assertLessEqual(len(wave),48000)
    np.testing.assert_array_equal(wave,lib.synthesize(family,variant))
    self.assertLess(abs(wave[0]),.001);self.assertLess(abs(wave[-1]),.001)
    fingerprints.add(wave.tobytes())
  self.assertEqual(len(fingerprints),len(lib.FAMILIES)*3)
 def test_unknown_sound_rejected(self):
  with self.assertRaises(ValueError):lib.synthesize('unknown',0)
if __name__=='__main__':unittest.main()
