import paramiko, os

HOST = '192.99.7.220'
PORT = 2222
USER = 'root'
PASS = 'VeronicaTapia1972+_)('
REMOTE = '/var/www/vhosts/infoplay.com/verospetcare.infoplay.com'
LOCAL  = r'C:\Users\richardgamarra\projects\petcare'

files = ['index.html', 'services.html']

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=PORT, username=USER, password=PASS)
sftp = ssh.open_sftp()
for f in files:
    sftp.put(os.path.join(LOCAL, f), REMOTE + '/' + f)
    print(f'OK {f}')
sftp.close()
ssh.close()
print('Done.')
