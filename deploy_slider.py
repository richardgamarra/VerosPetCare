import paramiko, os

HOST = '192.99.7.220'
PORT = 2222
USER = 'root'
PASS = 'VeronicaTapia1972+_)('
REMOTE = '/var/www/vhosts/infoplay.com/verospetcare.infoplay.com'
LOCAL  = r'C:\Users\richardgamarra\projects\petcare'

files = [
    'index.html',
    'style.css',
    'main.js',
    'img/slider-1.jpg',
    'img/slider-2.jpg',
    'img/slider-3.jpg',
    'img/slider-4.jpg',
    'img/slider-5.jpg',
    'img/slider-6.jpg',
    'img/slider-7.jpg',
    'img/slider-8.jpg',
    'img/slider-9.jpg',
    'img/slider-10.jpg',
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
