z = "<email:'listcreative15@gmail.com'><name:'List Creative'><id:2>"
item = z.split('<')[1:]
for p in item:
    print(p.split(':')[1].split('>')[0])