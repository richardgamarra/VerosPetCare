import paramiko, os

HOST = '192.99.7.220'
PORT = 2222
USER = 'root'
PASS = 'VeronicaTapia1972+_)('
REMOTE = '/var/www/vhosts/infoplay.com/verospetcare.infoplay.com'
LOCAL  = r'C:\Users\richardgamarra\projects\petcare'

files = [
    'gallery.html',
    'img/dog-sadie.jpg',
    'img/dog-coco.jpg',
    'img/dog-charlie.jpg',
    'img/dog-rex.jpg',
    'img/dog-mochi.jpg',
    'img/dog-oliver.jpg',
    'img/dog-teddy.jpg',
]

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=PORT, username=USER, password=PASS)
sftp = ssh.open_sftp()

for f in files:
    local_path  = os.path.join(LOCAL, f.replace('/', os.sep))
    remote_path = REMOTE + '/' + f
    sftp.put(local_path, remote_path)
    print(f'OK {f}')

sftp.close()
ssh.close()
print('Deploy complete.')
