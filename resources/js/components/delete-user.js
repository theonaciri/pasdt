define(["jquery", "./lang"], function($,lang) {
	$("body").on("click", ".deleteLink", (e) => {
		e.preventDefault();
        $this = $(e.currentTarget);
		if (confirm(lang(`You are about to permanently delete this user`) + "\n" + lang(`Are you sure`) + "?")){
			$.ajax({
				url: $this.attr("href")
			})
			.done((data) => {
				$('#user-error').addClass('d-none');
				$this.parents('tr').remove();
			}).fail((jqXHR, textStatus ) => {
				$('#user-error').removeClass('d-none');
				console.err(textStatus);
				if (textStatus && textStatus.error && textStatus.error.length) {
					$("#user-error > .error-msg").html(textStatus.error)
				}
			});
		}
    });
});