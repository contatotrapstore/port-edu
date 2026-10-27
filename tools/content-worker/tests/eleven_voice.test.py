import pathlib,sys,unittest
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
from eleven_voice import alignment_words,cache_key
class VoiceTests(unittest.TestCase):
 def test_alignment_groups_characters(self):
  a={'characters':list('Oi, dev!'),'character_start_times_seconds':[i*.1 for i in range(8)],'character_end_times_seconds':[(i+1)*.1 for i in range(8)]}
  w=alignment_words(a)
  self.assertEqual([x['text'] for x in w],['Oi,','dev!'])
  self.assertEqual(w[1]['offset'],4000000)
 def test_reject_missing_alignment(self):
  with self.assertRaises(ValueError):alignment_words({'characters':['a']})
 def test_cache_bound_to_voice_model_and_provider(self):
  self.assertNotEqual(cache_key('test','a','v4'),cache_key('test','b','v4'))
  self.assertNotEqual(cache_key('test','a','v4'),cache_key('test','a','v3'))
if __name__=='__main__':unittest.main()
