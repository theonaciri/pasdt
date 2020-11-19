
<?php
shell_exec("cd ~/projects/pasdt && php artisan schedule:run >> /dev/null 2>sh_err.log");
exit(0);
