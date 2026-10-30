import pathlib,sys,unittest
import numpy as np
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
from voice_ducking import narration_gain

class DuckingTest(unittest.TestCase):
 def test_speech_attenuates_backing_and_silence_recovers(self):
  sr=48000;voice=np.zeros(sr*2);voice[sr//2:sr]=.2
  before=voice.copy();gain=narration_gain(voice,len(voice),sr,16)
  self.assertAlmostEqual(float(gain[int(sr*.7)]),10**(-16/20),places=6)
  self.assertAlmostEqual(float(gain[int(sr*1.5)]),1,places=6)
  np.testing.assert_array_equal(voice,before)
 def test_preroll_release_and_shape(self):
  sr=48000;voice=np.zeros(sr);voice[24000:28800]=.1
  gain=narration_gain(voice,sr)
  self.assertLess(gain[23500],.2)
  self.assertLess(gain[31000],.2)
  self.assertEqual(len(gain),sr)
  self.assertTrue(np.all((gain>0)&(gain<=1)))
 def test_no_voice_leaves_backing_unchanged(self):
  np.testing.assert_array_equal(narration_gain([],100),np.ones(100))

if __name__=='__main__':unittest.main()
