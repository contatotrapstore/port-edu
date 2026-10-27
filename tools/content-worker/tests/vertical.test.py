import sys, pathlib, unittest
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
from vertical_render import validate_script, subtitle_groups
class VerticalTests(unittest.TestCase):
 def test_invalid_and_excessive_scripts(self):
  for data in ({'format':'carousel','slides':['a','b']},{'format':'reel','slides':['a']},{'format':'story','slides':['x'*501,'b']}):
   with self.assertRaises(ValueError):validate_script(data)
 def test_manual_scenes_and_word_timing(self):
  result=validate_script({'format':'reel','slides':['Agente. Uma resposta não confirma execução.','Confirme. Confira o registro no sistema.']})
  self.assertEqual(result[0]['title'],'Agente.')
  self.assertIn('execução',result[0]['narration'])
  words=[{'text':str(i),'offset':i*10000000,'duration':5000000} for i in range(8)]
  chunks=subtitle_groups(words)
  self.assertEqual(chunks[0]['start'],0)
  self.assertEqual(chunks[1]['start'],6)
if __name__=='__main__':unittest.main()
